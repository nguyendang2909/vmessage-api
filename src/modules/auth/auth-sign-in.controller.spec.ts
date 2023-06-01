import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';

import { SignInData } from './auth.type';
import { AuthSignInController } from './auth-sign-in.controller';
import { AuthSignInService } from './auth-sign-in.service';
import { SignInWithPhoneNumberAndPasswordDto } from './dto/login-by-phone-number.dto';
import { SignInWithPhoneNumberDto } from './dto/register-auth.dto';
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
      const signInByPhoneNumberDto = createMock<SignInWithPhoneNumberDto>({
        token: 'abxyz',
      });
      const mockSignInData = createMock<SignInData>({
        accessToken: 'abcxyz',
      });

      jest
        .spyOn(service, 'signInWithPhoneNumber')
        .mockResolvedValue(mockSignInData);

      const result = controller['signInWithPhoneNumber'](
        signInByPhoneNumberDto,
      );

      await expect(result).resolves.toEqual({
        type: 'sigInWithPhoneNumber',
        data: mockSignInData,
      });
      expect(service.signInWithPhoneNumber).toHaveBeenCalledWith(
        signInByPhoneNumberDto,
      );
    });
  });

  describe('#signInWithPhoneNumberAndPassword', () => {
    it('Should sign in by phone number with password successfully', async () => {
      const signInWithPhoneNumberAndPasswordDto =
        createMock<SignInWithPhoneNumberAndPasswordDto>({
          phoneNumber: '+84989898',
          password: 'abcxyzs',
        });
      const mockSignInData = createMock<SignInData>({
        accessToken: 'abcxyz',
      });

      jest
        .spyOn(service, 'signInWithPhoneNumberAndPassword')
        .mockResolvedValue(mockSignInData);

      const result = controller['signInWithPhoneNumberAndPassword'](
        signInWithPhoneNumberAndPasswordDto,
      );

      await expect(result).resolves.toEqual({
        type: 'signInWithPhoneNumberAndPassword',
        data: mockSignInData,
      });
      expect(service.signInWithPhoneNumberAndPassword).toHaveBeenCalledWith(
        signInWithPhoneNumberAndPasswordDto,
      );
    });
  });
});
