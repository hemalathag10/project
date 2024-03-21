import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegressionService {
    coefficients: number[] | undefined;

    constructor() {
        this.initializeCoefficients();
    }

    initializeCoefficients(): void {
        // Initialize coefficients for a simple multiple linear regression model
        this.coefficients = [0, 0, 0, 0, 0]; // Example initialization
    }

    predictPrice(features: number[]): number {
        // Check if coefficients are defined
        if (!this.coefficients || this.coefficients.length !== features.length + 1) {
            throw new Error('Coefficients not initialized or invalid');
        }
      
        // Check if features are valid numbers
        if (features.some(isNaN)) {
            throw new Error('Invalid features');
        }
      
        // Perform prediction using coefficients and features
        let predictedPrice = this.coefficients[0]; // Intercept
        for (let i = 0; i < features.length; i++) {
            predictedPrice += this.coefficients[i + 1] * features[i]; // Feature * Coefficient
        }
      
        // Check if predicted price is valid
        if (isNaN(predictedPrice)) {
            throw new Error('Prediction resulted in NaN');
        }
      
        return predictedPrice;
    }

    // This method updates the coefficients based on the provided data
    fit(X: number[][], y: number[]): void {
        if (!X || !y || X.length !== y.length || X.length === 0) {
            throw new Error('Invalid input data for fitting');
        }

        // Perform matrix operations to solve for coefficients
        // For simplicity, let's assume that the matrix (X'X) is invertible
        const XtX = this.transposeMultiply(X);
        const XtY = this.transposeMultiplyVector(X, y);
        this.coefficients = this.solveEquations(XtX, XtY);
    }

    private solveEquations(XtX: number[][], XtY: number[]): number[] {
        // Solving equations using Gaussian elimination or other methods
        // For simplicity, let's assume that the matrix (X'X) is invertible
        return this.gaussianElimination(XtX, XtY);
    }

    private gaussianElimination(matrix: number[][], vector: number[]): number[] {
        const n = vector.length;
        const coefficients = new Array(n).fill(0);

        // Forward Elimination
        for (let i = 0; i < n; i++) {
            for (let k = i + 1; k < n; k++) {
                const ratio = matrix[k][i] / matrix[i][i];
                for (let j = i; j < n; j++) {
                    matrix[k][j] -= ratio * matrix[i][j];
                }
                vector[k] -= ratio * vector[i];
            }
        }

        // Back Substitution
        for (let i = n - 1; i >= 0; i--) {
            let sum = 0;
            for (let j = i + 1; j < n; j++) {
                sum += matrix[i][j] * coefficients[j];
            }
            coefficients[i] = (vector[i] - sum) / matrix[i][i];
        }

        return coefficients;
    }

    private transposeMultiply(matrix: number[][]): number[][] {
        // Transpose and multiply matrix by its transpose
        const result: number[][] = [];
        const n = matrix.length;
        for (let i = 0; i < n; i++) {
            result[i] = [];
            for (let j = 0; j < n; j++) {
                let sum = 0;
                for (let k = 0; k < matrix[0].length; k++) {
                    sum += matrix[i][k] * matrix[j][k];
                }
                result[i][j] = sum;
            }
        }
        return result;
    }

    private transposeMultiplyVector(matrix: number[][], vector: number[]): number[] {
        // Transpose and multiply matrix by a vector
        const result: number[] = [];
        const n = matrix[0].length;
        for (let i = 0; i < n; i++) {
            let sum = 0;
            for (let j = 0; j < vector.length; j++) {
                sum += matrix[j][i] * vector[j];
            }
            result[i] = sum;
        }
        return result;
    }
}
