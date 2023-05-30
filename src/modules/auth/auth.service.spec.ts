import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from './auth-sign-in.service';
import { AuthUsersService } from './auth-users.service';
import { LoginByPhoneNumberDto } from './dto/login-by-phone-number.dto';
import { EncryptionsService } from './encryptions.service';

describe('AuthService', () => {
  let service: AuthService;
  let authUsersService: AuthUsersService;
  let encryptionsService: EncryptionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: AuthUsersService,
          useValue: createMock(),
        },
        {
          provide: EncryptionsService,
          useValue: createMock(),
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    authUsersService = module.get<AuthUsersService>(AuthUsersService);
    encryptionsService = module.get<EncryptionsService>(EncryptionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('#loginByPhoneNumber', () => {
    it('Should login by phone number successfully', async () => {
      const mockPhoneNumber = '+84971016191';

      const mockPassword = '12345678';

      const mockLoginByPhoneNumberDto = createMock<LoginByPhoneNumberDto>({
        phoneNumber: mockPhoneNumber,
        password: mockPassword,
      });

      const mockHashedPassword = 'asdjakjsdhkahdkjhsd';

      const mockReturnFindOneUser = {
        id: '12345',
        password: mockHashedPassword,
      };

      const mockJwt = 'jkhajskdhakjshdkajhsd';

      jest
        .spyOn(authUsersService, 'findOneOrFail')
        .mockResolvedValue(mockReturnFindOneUser);

      jest
        .spyOn(encryptionsService, 'isMatchWithHashedKey')
        .mockReturnValue(true);

      jest.spyOn(encryptionsService, 'signJwt').mockReturnValue(mockJwt);

      const result = service.loginByPhoneNumber(mockLoginByPhoneNumberDto);

      await expect(result).resolves.toEqual({ token: mockJwt });

      expect(authUsersService.findOneOrFail).toHaveBeenCalledWith(
        {
          phoneNumber: mockPhoneNumber,
        },
        { selects: ['password'] },
      );

      expect(encryptionsService.isMatchWithHashedKey).toHaveBeenLastCalledWith(
        mockPassword,
        mockHashedPassword,
      );
    });

    it('Should login fail when type wrong password', async () => {
      const mockPhoneNumber = '+84971016191';

      const mockPassword = '12345678';

      const mockLoginByPhoneNumberDto = createMock<LoginByPhoneNumberDto>({
        phoneNumber: mockPhoneNumber,
        password: mockPassword,
      });

      const mockHashedPassword = 'asdjakjsdhkahdkjhsd';

      const mockReturnFindOneUser = {
        id: '12345',
        password: mockHashedPassword,
      };

      jest
        .spyOn(authUsersService, 'findOneOrFail')
        .mockResolvedValue(mockReturnFindOneUser);

      jest
        .spyOn(encryptionsService, 'isMatchWithHashedKey')
        .mockReturnValue(false);

      const result = service.loginByPhoneNumber(mockLoginByPhoneNumberDto);

      await expect(result).rejects.toThrowError(
        'Phone number or password is not correct!',
      );

      expect(authUsersService.findOneOrFail).toHaveBeenCalledWith(
        {
          phoneNumber: mockPhoneNumber,
        },
        { selects: ['password'] },
      );

      expect(encryptionsService.isMatchWithHashedKey).toHaveBeenLastCalledWith(
        mockPassword,
        mockHashedPassword,
      );
    });
  });
});
