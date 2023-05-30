import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from './auth-sign-in.controller';
import { AuthService } from './auth-sign-in.service';
import { LoginByPhoneNumberDto } from './dto/login-by-phone-number.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: createMock(),
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('#Login by phone number', () => {
    it('Should login by phone number successfully', async () => {
      const loginByPhoneNumberDto = createMock<LoginByPhoneNumberDto>({
        phoneNumber: '+84971016191',
        password: '12345678',
      });

      const mockReturnToken = {
        token: '54321',
      };

      jest
        .spyOn(service, 'loginByPhoneNumber')
        .mockResolvedValue(mockReturnToken);

      const result = controller['loginByPhoneNumber'](loginByPhoneNumberDto);

      await expect(result).resolves.toEqual({
        type: 'loginByPhoneNumber',
        data: mockReturnToken,
      });

      expect(service.loginByPhoneNumber).toHaveBeenCalledWith(
        loginByPhoneNumberDto,
      );
    });
  });
});
