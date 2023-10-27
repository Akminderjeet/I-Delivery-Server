import express, { Router } from "express";
const router = express.Router();
import dotenv from 'dotenv';
import { response } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { createProfile } from "../Controllers/AgentController.js";

router.get('/createProfile', createProfile);

export default router