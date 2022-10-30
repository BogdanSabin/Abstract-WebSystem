import { Model, Mongoose } from 'mongoose';
import { PasswordCypher } from '../bzl/lib/PasswordCypher';
import { Image } from './lib/Image';
import { ModelLib } from './lib/ModelLib';
import { Order } from './lib/Order';
import { Product } from './lib/Product';
import { Site } from './lib/Site';
import { User } from './lib/User';
import { ImageModelType } from './types/ImageTypes';
import { OrderModelType } from './types/OrderTypes';
import { ProductModelType } from './types/ProductTypes';
import { SiteModelType } from './types/SiteTypes';
import { UserModelType } from './types/UserTypes';

export class ModelsFactory {
    readonly userModelLib: ModelLib<UserModelType>;
    readonly siteModelLib: ModelLib<SiteModelType>;
    readonly productModelLib: ModelLib<ProductModelType>;
    readonly orderModelLib: ModelLib<OrderModelType>;
    readonly imageModelLib: ModelLib<ImageModelType>;

    readonly userModel: Model<UserModelType>;
    readonly siteModel: Model<SiteModelType>;
    readonly productModel: Model<ProductModelType>;
    readonly orderModel: Model<OrderModelType>;
    readonly imageModel: Model<ImageModelType>;

    constructor(mongoose: Mongoose, passwordCypher: PasswordCypher) {
        this.userModelLib = new User(mongoose, this, passwordCypher);
        this.siteModelLib = new Site(mongoose, this);
        this.productModelLib = new Product(mongoose, this);
        this.orderModelLib = new Order(mongoose, this);
        this.imageModelLib = new Image(mongoose, this);

        this.userModel = this.userModelLib.Model;
        this.siteModel = this.siteModelLib.Model;
        this.productModel = this.productModelLib.Model;
        this.orderModel = this.orderModelLib.Model;
        this.imageModel = this.imageModelLib.Model;
    }

    getUserModel(): Model<UserModelType> { return this.userModel }
    getSiteModel(): Model<SiteModelType> { return this.siteModel }
    getProductModel(): Model<ProductModelType> { return this.productModel }
    getOrderModel(): Model<OrderModelType> { return this.orderModel }
    getImageModel(): Model<ImageModelType> { return this.imageModel }
}