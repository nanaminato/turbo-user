import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageTaskService {
  private runningTaskIds = new Set<string>();

  private tasksSubject = new BehaviorSubject<string[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  registerTask(taskId: string) {
    this.runningTaskIds.add(taskId);
    this.updateState();
  }


  unregisterTask(taskId: string) {
    this.runningTaskIds.delete(taskId);
    this.updateState();
  }

  stopTask(taskId: string) {
    this.runningTaskIds.delete(taskId);
    this.updateState();
  }
  stopAllTasks() {
    this.runningTaskIds.clear();
    this.updateState();
  }

  isTaskRunning(taskId: string): boolean {
    return this.runningTaskIds.has(taskId);
  }

  private updateState() {
    this.tasksSubject.next(Array.from(this.runningTaskIds));
    this.loadingSubject.next(this.runningTaskIds.size > 0);
  }
}
