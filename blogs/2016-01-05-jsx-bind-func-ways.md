# React JSX调用类方法总结


### 1. 使用 `Function.prototype.bind()`

    export default class CartItem extends React.Component {
        render() {
            <button onClick={this.increaseQty.bind(this)} className="button success">+</button>
        }
    }

### 2. 在ES类构造器中使用 `bind()` 函数


    class CartItem extends React.Component {

        constructor(props) {
            super(props);
            this.increaseQty = this.increaseQty.bind(this);
        }

        render() {
            <button onClick={this.increaseQty} className="button success">+</button>
        }
    }


### 3. 在ES类构造器中使用箭头语法

    class CartItem extends React.Component {

        constructor(props) {
            super(props);
            this._increaseQty = () => this.increaseQty();
        }

        render() {
            <button onClick={this._increaseQty} className="button success">+</button>
        }
    }

### 4. 在ES类中使用箭头语法

    export default class CartItem extends React.Component {

        increaseQty = () => this.increaseQty();

        render() {
            <button onClick={this.increaseQty} className="button success">+</button>
        }
    }

### 5. 在ES类构造器中使用ES7的双冒号 `::` 语法糖

    export default class CartItem extends React.Component {

        constructor(props) {
            super(props);
            this.increaseQty = ::this.increaseQty;
            //等同于 this.increaseQty = this.increaseQty.bind(this);
        }

        render() {
            <button onClick={this.increaseQty} className="button success">+</button>
        }
    }

### 6. 直接在JSX代码中使用双冒号 `::` 语法糖

    export default class CartItem extends React.Component {
        render() {
            <button onClick={::this.increaseQty} className="button success">+</button>
        }
    }
