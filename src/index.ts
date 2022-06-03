import 'dotenv/config'
import * as Express from 'express';
import { AppDataSource } from './data-source'
import balances from './controllers/balances';

AppDataSource.initialize().then(async () => {

    // console.log("Inserting a new user into the database...")
    // const user = new Balance()
    // user.firstName = "Timber"
    // user.lastName = "Saw"
    // user.age = 25
    // await AppDataSource.manager.save(user)
    // console.log("Saved a new user with id: " + user.id)

    // console.log("Loading users from the database...")
    // const users = await AppDataSource.manager.find(User)
    // console.log("Loaded users: ", users)

    // console.log("Here you can setup and run express / fastify / any other framework.")


    const app = Express();

    app.use(Express.json());
    app.use(Express.urlencoded());

    app.use('/balances', balances);
    
    console.log(`Server started at :${process.env.PORT}`);

    app.listen(process.env.PORT);

}).catch(error => console.log(error))
