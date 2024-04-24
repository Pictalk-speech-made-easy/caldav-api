import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { BaikalService } from '../baikal/baikal.service';
import { UserDto } from 'src/keycloak/user.dto';

@Injectable()
export class BaikalUserGuard implements CanActivate {
  constructor(private baikalService: BaikalService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as UserDto;
    const baikalUser = await this.baikalService.isUserExisting(user.sub);
    return !!baikalUser;
  }
}
