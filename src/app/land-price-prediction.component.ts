import { Component } from '@angular/core';
import * as math from 'mathjs'; // Import math.js library

@Component({
  selector: 'app-land-price-prediction',
  templateUrl: './land-price-prediction.component.html',
})
export class LandPricePredictionComponent {
  formData = {
    houseAge: 0,
    distanceToMRT: 0,
    numConvenienceStores: 0,
    latitude: 0,
    longitude: 0
  };

  predictedPrice: number | null = null;

  data = [
    { houseAge: 10, distanceToMRT: 500, numConvenienceStores: 5, latitude: 25.1234, longitude: 121.5432, price: 100000 },
    { houseAge: 15, distanceToMRT: 800, numConvenienceStores: 2, latitude: 24.9876, longitude: 121.3210, price: 150000 },
    { houseAge: 20, distanceToMRT: 1000, numConvenienceStores: 3, latitude: 24.8765, longitude: 121.2345, price: 180000 }
  ];

  trainModel(data: any[]) {
    const X = data.map(row => [1, row.houseAge, row.distanceToMRT, row.numConvenienceStores, row.latitude, row.longitude]);
    const Y = data.map(row => row.price);
    const Xt = math.transpose(X);
    const XtX = math.multiply(Xt, X);
    const XtY = math.multiply(Xt, Y);
    const invXtX = math.inv(XtX);
    return math.multiply(invXtX, XtY);
  }

  predictPrice(features: number[], coefficients: number[]) {
    let predictedPrice = 0;
    for (let i = 0; i < features.length; i++) {
      predictedPrice += coefficients[i] * features[i];
    }
    return predictedPrice;
  }

  splitData(data: any[], splitRatio: number) {
    const splitIndex = Math.floor(data.length * splitRatio);
    const shuffledData = data.slice().sort(() => Math.random() - 0.5);
    const trainingData = shuffledData.slice(0, splitIndex);
    const testingData = shuffledData.slice(splitIndex);
    return { trainingData, testingData };
  }

  evaluateModel(testingData: any[], coefficients: number[]) {
    const features = testingData.map(row => [1, row.houseAge, row.distanceToMRT, row.numConvenienceStores, row.latitude, row.longitude]);
    const actualPrices = testingData.map(row => row.price);
    const predictedPrices = features.map(feature => this.predictPrice(feature, coefficients));
    return { actualPrices, predictedPrices };
  }

  calculateMetrics(actualPrices: number[], predictedPrices: number[]) {
    const errors = actualPrices.map((actual, index) => actual - predictedPrices[index]);
    const absoluteErrors = errors.map(error => Math.abs(error));
    const meanAbsoluteError = absoluteErrors.reduce((sum, error) => sum + error, 0) / absoluteErrors.length;
    const squaredErrors = errors.map(error => error ** 2);
    const meanSquaredError = squaredErrors.reduce((sum, error) => sum + error, 0) / squaredErrors.length;
    const rootMeanSquaredError = Math.sqrt(meanSquaredError);
    return { meanAbsoluteError, meanSquaredError, rootMeanSquaredError };
  }

  predictLandPrice() {
    const { trainingData, testingData } = this.splitData(this.data, 0.8); // Split data into training and testing sets
    const coefficients = this.trainModel(trainingData); // Train model on training set
    const { actualPrices, predictedPrices } = this.evaluateModel(testingData, coefficients); // Evaluate model on testing set
    const { meanAbsoluteError, meanSquaredError, rootMeanSquaredError } = this.calculateMetrics(actualPrices, predictedPrices); // Calculate evaluation metrics
    console.log('Mean Absolute Error:', meanAbsoluteError);
    console.log('Mean Squared Error:', meanSquaredError);
    console.log('Root Mean Squared Error:', rootMeanSquaredError);
    this.predictedPrice = predictedPrices[0]; // For demonstration, display the predicted price for the first data point
  }
}
