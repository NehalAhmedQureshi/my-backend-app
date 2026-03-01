import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { Task } from './tasks/task.entity';
import { User } from './auth/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'aws-1-ap-southeast-1.pooler.supabase.com',
      port: 6543,
      username: 'postgres.kzbiqbmcliucmkatzxkv',
      password: 'OdwWwnG24MR54l',
      database: 'postgres',
      // url: 'postgresql://postgres:OdwWwnG24MR54l@db.kzbiqbmcliucmkatzxkv.supabase.co:5432/postgres',
      autoLoadEntities: true, // Crucial: Finds your classes automatically
      synchronize: true, // Warning: Only for development! It updates tables automatically.
      ssl: true,
      extra: {
        ssl: {
          rejectUnauthorized: false, // Prevents certificate errors
        },
      },
    }),
    TasksModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
