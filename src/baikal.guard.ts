import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { BaikalService } from './baikal/baikal.service';

@Injectable()
export class BaikalUserGuard implements CanActivate {
  constructor(private baikalService: BaikalService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const baikalUser = await this.baikalService.isUserExisting(user.email);
    return !!baikalUser;
  }
}
