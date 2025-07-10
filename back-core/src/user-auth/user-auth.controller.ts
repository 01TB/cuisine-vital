
import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserAuthService } from './user-auth.service';

@Controller('user-auth')
export class UserAuthController {
    constructor(private userAuthService: UserAuthService) {}

    @UseGuards(AuthGuard('local-user'))
    @Post('login')
    async login(@Request() req) {
        return this.userAuthService.login(req.user);
    }
}
