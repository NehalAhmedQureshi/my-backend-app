import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { generate } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async sign_up(
    first_name: string,
    last_name: string,
    email: string,
    password: string,
  ): Promise<User> {
    // 1. Check if user already exists
    const exist = await this.userRepository.findOne({ where: { email } });
    if (exist) {
      throw new Error('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. Create and save user
    const user = this.userRepository.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
    });

    return await this.userRepository.save(user);
  }

  async sign_in(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email },relations: ['tasks'] });
    if (!user) {
      throw new Error('User not found');
    }
    // Compare the plain text password with the hashed one in DB
    const isMatch = user
      ? await bcrypt.compare(password, user.password)
      : false;
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    // 3. Create the "Data" for the ticket (Payload)
    const payload = { sub: user.id, email: user.email };
    // 4. Generate the JWT token
    const {access_token,expires_in} = await this.generateToken(payload);

    return {
      user,
      extra:{ access_token, expires_in }
    };
  }

  async generateToken(user: any) {
    const payload = { ...user };
    let token = await this.jwtService.signAsync(payload);
    let expires_in = this.jwtService.decode(token)['exp'] - Math.floor(Date.now() / 1000); // Calculate remaining time until token expires
    return { access_token: token, expires_in };
  }

  async get_me(userId: string): Promise<any> {
    console.log('🚀 ~ AuthService ~ get_me ~ userId:', userId);
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const payload = { sub: user.id, email: user.email };
    const {access_token , expires_in} = await this.generateToken(payload);

    const { password, ...details } = user; // Exclude password from response
    return { details, extra: { access_token, expires_in } };
  }
  
}
