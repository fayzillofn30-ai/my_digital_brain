# ApiProperty example yozish

### 👤 Foydalanuvchi:

Salom 

BUnga  ApiPrperty example yozib ber

### 🤖 ChatGPT:

Salom 🙂  

`@ApiProperty` dekoratori **NestJS Swagger** uchun ishlatiladi. U model (DTO) ichidagi property haqida hujjatlash (docs) yaratadi va `example` qo‘shish orqali Swagger UI’da namunaviy qiymat ko‘rsatish mumkin.  

Masalan:  

```ts
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'john_doe',
    description: 'Unique username of the user',
  })
  username: string;

  @ApiProperty({
    example: 'John',
    description: 'First name of the user',
  })
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Last name of the user',
  })
  lastName: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'Email address of the user',
  })
  email: string;

  @ApiProperty({
    example: 'strongPassword123!',
    description: 'Password for account login',
  })
  password: string;
}
```

👉 Shunda Swagger UI’da har bir field yonida **example** qiymatlar chiqib turadi.  

Aytchi, sening DTO’ing qanaqa fieldlardan iborat? Shu bo‘yicha moslab `ApiProperty` yozib beraymi?

---

