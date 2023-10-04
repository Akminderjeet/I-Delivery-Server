import express, { Router } from "express";
const router = express.Router();
import dotenv from 'dotenv';
import { response } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { createDelivery } from "../Controllers/ClientController.js";

router.post('/createDelivery', createDelivery);

export default router