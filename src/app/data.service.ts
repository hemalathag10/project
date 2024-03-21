// data.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  // Method to fetch the dataset
  getLandData(): Observable<any> {
    return this.http.get<any>('assets/real_estate.csv');
  }

  // Method to preprocess the data
  preprocessData(data: any): { X: number[][], y: number[] } {
    const X: number[][] = [];
    const y: number[] = [];

    data.forEach((row: any) => {
      // Extract relevant features for land price prediction
      const features = [
        row['X2 house age'],
        row['X3 distance to the nearest MRT station'],
        row['X4 number of convenience stores'],
        row['X5 latitude'],
        row['X6 longitude']
      ];
      X.push(features);
      y.push(row['Y house price of unit area']);
    });

    return { X, y };
  }
}
