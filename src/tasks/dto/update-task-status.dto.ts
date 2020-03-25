import { TaskStatus } from '../task-status.model';
import { IsIn } from 'class-validator';

export class UpdateTaskStatusDto {
  @IsIn([TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
  status: TaskStatus;
}
