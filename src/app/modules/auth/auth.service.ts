import { Result } from './../../../generated/prisma/client/internal/prismaNamespace';
import { Request } from "express";
import bcrypt from "bcryptjs";
import { prisma } from '../../shared/prisma';

const ctreateGuideService=async(req:Request)=>{

const  hashedPassword= await bcrypt.hash(req.body.password,10)

const Result= await prisma.guide.create({
    data: {
        ...req.body,
        password: hashedPassword
    }
})

}