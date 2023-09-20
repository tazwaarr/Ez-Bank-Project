class User {
    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get accNo() {
        return this._accNo;
    }

    set accNo(value) {
        this._accNo = value;
    }

    get accPin() {
        return this._accPin;
    }

    set accPin(value) {
        this._accPin = value;
    }
    constructor(id, name, accNo, accPin) {
        this._id = id;
        this._name = name;
        this._accNo = accNo;
        this._accPin = accPin;
    }

    updateUserInDB(dataArr, FBHandler) {
        FBHandler('Update', dataArr)
    }
}

class Bank {
    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get maxRes() {
        return this._maxRes;
    }

    set maxRes(value) {
        this._maxRes = value;
    }

    get FBHandler() {
        return this._FBHandler;
    }

    set FBHandler(value) {
        this._FBHandler = value;
    }

    constructor(id, name, maxRes, FBHandler) {
        this._id = id;
        this._name = name;
        this._maxRes = maxRes;
        this._FBHandler = FBHandler;
    }

}

class FirebaseHandler {
    FBHandler(task) {
        FB.FBInit();
        FB.deployInstance();
        FB.doTask(task);
    }

}

