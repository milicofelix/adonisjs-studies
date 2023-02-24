import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException';
import User from 'App/Models/User'
import CreateUserValidator from 'App/Validators/CreateUserValidator';

export default class UsersController {
  public async store({request,response}: HttpContextContract) {
    const userPayload = request.only(['email','username', 'password', 'avatar']);
    // const userPayload = await request.validate(CreateUserValidator);
    const dataRequired = (!userPayload.username && !userPayload.email && !userPayload.password);

    if(dataRequired) {
      throw new BadRequestException('Provide required data',422);
    }

    if(!userPayload.email) {
      throw new BadRequestException('Provide required email',422);
    }

    if(!userPayload.password) {
      throw new BadRequestException('Provide required password',422);
    }
    const userByEmail = await User.findBy('email', userPayload.email);
    const userByName = await User.findBy('username', userPayload.username);

    if(userByName) {
      //return response.conflict({message: 'User name already in use'});
      throw new BadRequestException('User name already in use',409);
    }
    if(userByEmail) {
      throw new BadRequestException('E-mail already in use',409);
    }
    const user = await User.create(userPayload);
      return response.created({user});
  }
  public async update({request, response}: HttpContextContract) {
    const {email, password, avatar} = request.only(['email', 'password', 'avatar']);
    const id = request.param('id');
    const user = await User.findOrFail(id);

    (await user).email = email;
    (await user).password = password;
    if(avatar)(await user).avatar = avatar;

    (await user).save();

    return response.ok({user});
  }
}
