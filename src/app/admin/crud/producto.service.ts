import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class CrudService {
  constructor() {}

  getAll(module: string): any[] {
    return JSON.parse(localStorage.getItem(module) || '[]');
  }

  save(module: string, data: any): void {
    localStorage.setItem(module, JSON.stringify(data));
  }

  add(module: string, item: any): void {
    const data = this.getAll(module);
    item.id = data.length > 0 ? Math.max(...data.map(i => i.id)) + 1 : 1;
    data.push(item);
    this.save(module, data);
  }

  update(module: string, id: number, updatedItem: any): void {
    const data = this.getAll(module);
    const index = data.findIndex(i => i.id === id);
    if (index !== -1) {
      updatedItem.id = id;
      data[index] = updatedItem;
      this.save(module, data);
    }
  }

  delete(module: string, id: number): void {
    const data = this.getAll(module).filter(i => i.id !== id);
    this.save(module, data);
  }

  getById(module: string, id: number): any {
    return this.getAll(module).find(i => i.id === id);
  }
}
