import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseService } from './database.service';
import { DATABASE_URL } from '../commons/constants/envirements'; // Ajuste o caminho para o arquivo correto

@Module({
  imports: [
    MongooseModule.forRoot(DATABASE_URL), // Configuração da conexão
  ],
  providers: [DatabaseService], // Registre o serviço
  exports: [DatabaseService], // Exporte se precisar em outros módulos
})
export class AppModule {}
