import * as users from '../services/user.service.js';
export async function list(req,res){res.json({users:await users.listUsers()});}
export async function create(req,res){res.status(201).json({user:await users.createUser(req.validated.body)});}
export async function update(req,res){res.json({user:await users.updateUser(req.validated.params.id,req.validated.body)});}
export async function remove(req,res){await users.deleteUser(req.validated.params.id,req.user.id);res.status(204).send();}
