import { IsNumber, IsString, IsEmail } from 'class-validator';

export class SubmitTestResultDto {
  @IsNumber()
  score: number;

  @IsString()
  userName: string;

  @IsString()
  userPhone: string;

  @IsEmail()
  userEmail: string;
}
