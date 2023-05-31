import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';

import { SignInData } from './auth.type';
import { AuthSignInController } from './auth-sign-in.controller';
import { AuthSignInService } from './auth-sign-in.service';
import { SignInByPhoneNumberWithPasswordDto } from './dto/login-by-phone-number.dto';
import { SignInByPhoneNumberDto } from './dto/register-auth.dto';
import { FirebaseService } from './firebase.service';

describe('AuthController', () => {
  let controller: AuthSignInController;
  let service: AuthSignInService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthSignInController],
      providers: [
        {
          provide: AuthSignInService,
          useValue: createMock(),
        },
        {
          provide: FirebaseService,
          useValue: createMock(),
        },
      ],
    }).compile();

    controller = module.get<AuthSignInController>(AuthSignInController);
    service = module.get<AuthSignInService>(AuthSignInService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('#signInByPhoneNumber', () => {
    it('Should sign in by phone number successfully', async () => {
      const signInByPhoneNumberDto = createMock<SignInByPhoneNumberDto>({
        token: 'abxyz',
      });
      const mockSignInData = createMock<SignInData>({
        accessToken: 'abcxyz',
      });

      jest
        .spyOn(service, 'signInByPhoneNumber')
        .mockResolvedValue(mockSignInData);

      const result = controller['signInByPhoneNumber'](signInByPhoneNumberDto);

      await expect(result).resolves.toEqual({
        type: 'sigInByPhoneNumber',
        data: mockSignInData,
      });
      expect(service.signInByPhoneNumber).toHaveBeenCalledWith(
        signInByPhoneNumberDto,
      );
    });
  });

  describe('#signInByPhoneNumberWithPassword', () => {
    it('Should sign in by phone number with password successfully', async () => {
      const signInByPhoneNumberWithPasswordDto =
        createMock<SignInByPhoneNumberWithPasswordDto>({
          phoneNumber: '+84989898',
          password: 'abcxyzs',
        });
      const mockSignInData = createMock<SignInData>({
        accessToken: 'abcxyz',
      });

      jest
        .spyOn(service, 'signInByPhoneNumberWithPassword')
        .mockResolvedValue(mockSignInData);

      const result = controller['signInByPhoneNumberWithPassword'](
        signInByPhoneNumberWithPasswordDto,
      );

      await expect(result).resolves.toEqual({
        type: 'signInByPhoneNumberWithPassword',
        data: mockSignInData,
      });
      expect(service.signInByPhoneNumberWithPassword).toHaveBeenCalledWith(
        signInByPhoneNumberWithPasswordDto,
      );
    });
  });
});
