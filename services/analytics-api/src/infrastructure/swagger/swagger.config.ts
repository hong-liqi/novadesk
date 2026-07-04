import { DocumentBuilder } from '@nestjs/swagger';

export function createSwaggerConfig(title: string, description: string) {
  return new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();
}
