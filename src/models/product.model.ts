import { Document } from 'mongoose';

export interface Product extends Document {
    name: string;
    description: string;
    image: string;
    price: number;
    limit?: number;
}