// Importing the express server and CORS packages
import keys from './keys.json' assert {type: 'json'};
import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';

// Initializing Express server
const app = express();
app.use(cors({
    origin: "*",
    methods: "*",
    headers: "*",
}));
app.use(bodyParser.json());

// Initializing backend port
const backendPort = keys.backendPort;

// Defining todoList JSON data list
let todoList = {
    '0': { 'id': '0', 'task': 'Learn about CloudFormation helper scripts.', 'status': false },
    '1': { 'id': '1', 'task': 'Launch server on EC2 instance.', 'status': true },
    '2': { 'id': '2', 'task': 'Make a to-do list.', 'status': false },
};

// The following function return todo item list array
async function allItems() {
    const todoListArray = Object.keys(todoList).map(function(id) { return todoList[id] });
    return todoListArray;
};

// The following function clears all todo list items
async function clearItems() {
    todoList = {};
};

// The following function adds a new item
async function addItem(itemData) {
    if (!itemData.id) {
        throw new Error('Task ID not provided');
    } else if (!itemData.task) {
        throw new Error('Task data not provided');
    } else {
        todoList[itemData.id] = { 'id': itemData.id, 'task': itemData.task, 'status': false };
    }
};

// The following function edits a new item
async function editItem(itemData) {
    if (!itemData.id) {
        throw new Error('Task ID not provided');
    } else if (!itemData.task) {
        throw new Error('Task data not provided');
    } else if (!todoList[itemData.id]) {
        throw new Error('Task ID is incorrect');
    } else {
        const tempStatus = todoList[itemData.id].status;
        todoList[itemData.id] = { 'id': itemData.id, 'task': itemData.task, 'status': tempStatus };
    }
};

// The following function removes a new item
async function removeItem(itemData) {
    if (!itemData.id) {
        throw new Error('Task ID not provided');
    } else if (!todoList[itemData.id]) {
        throw new Error('Task ID is incorrect');
    } else {
        delete todoList[itemData.id];
    }
};

// The following function changes the status of an item
async function changeItemStatus(itemData) {
    if (!itemData.id) {
        throw new Error('Task ID not provided');
    } else if (!todoList[itemData.id]) {
        throw new Error('Task ID is incorrect');
    } else {
        const tempTaskData = todoList[itemData.id].task;
        const tempStatus = todoList[itemData.id].status;
        todoList[itemData.id] = { 'id': itemData.id, 'task': tempTaskData, 'status': !tempStatus };
    }
};

// The following API call lists all the server actions
app.all('/', async function(req, res, next) {
    res.status(200).send('The following actions are supported on this server:<ul><li>/allItems —> GET request</li><li>/clearItems —> GET request</li><li>/addItem —> POST request</li><li>/editItem —> POST request</li><li>/removeItem/{id} —> GET request</li><li>/changeItemStatus/{id} —> GET request</li></ul>');
    next();
});

// The following API call return todo item list array
app.all('/allItems', async function(req, res, next) {
    try {
        const todoListData = await allItems();
        res.status(200).send({
            'success': true,
            'todoList': todoListData,
        });
    } catch (err) {
        res.status(404).send({
            'success': false,
            'errorMessage': `Server encountered an error ${err}`
        });
    }
    next();
});

// The following API call clears all todo list items
app.all('/clearItems', async function(req, res, next) {
    try {
        await clearItems();
        res.status(200).send({
            'success': true,
        });
    } catch (err) {
        res.status(404).send({
            'success': false,
            'errorMessage': `Server encountered an error ${err}`
        });
    }
    next();
});

// The following API call adds a new item
app.all('/addItem', async function(req, res, next) {
    try {
        const reqBody = req.body;
        await addItem(reqBody) ;
        res.status(200).send({
            'success': true,
        });
    } catch (err) {
        res.status(404).send({
            'success': false,
            'errorMessage': `Server encountered an error ${err}`
        });
    }
    next();
});

// The following API call edits a new item
app.all('/editItem', async function(req, res, next) {
    try {
        const reqBody = req.body;
        await editItem(reqBody);
        res.status(200).send({
            'success': true,
        });
    } catch (err) {
        res.status(404).send({
            'success': false,
            'errorMessage': `Server encountered an error ${err}`
        });
    }
    next();
});

// The following API call removes a new item
app.all('/removeItem/:id', async function(req, res, next) {
    try {
        await removeItem({id: req.params.id});
        res.status(200).send({
            'success': true,
        });
    } catch (err) {
        res.status(404).send({
            'success': false,
            'errorMessage': `Server encountered an error ${err}`
        });
    }
    next();
});

// The following API call changes the status of an item
app.all('/changeItemStatus/:id', async function(req, res, next) {
    try {
        await changeItemStatus({id: req.params.id});
        res.status(200).send({
            'success': true,
        });
    } catch (err) {
        res.status(404).send({
            'success': false,
            'errorMessage': `Server encountered an error ${err}`
        });
    }
    next();
});

// Starting Node server
app.listen(backendPort);
