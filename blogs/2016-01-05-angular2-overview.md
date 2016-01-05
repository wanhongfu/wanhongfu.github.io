Angular2简介
-------
***

## 整体构架


首先，Angular1与Angular2有很大不一样，虽然本人对Angular1用的不是太多，但感觉Angular2更像Facebook的Reactjs,或从JavaEE的角度来看，若Angular1是Struts1, 那么Angular2则更像是组件化的JSF.

下图引用自Angular官方网站对Angular2的整体架构的Big Picture:

![Angular2 Overview](https://angular.io/resources/images/devguide/architecture/overview2.png)

## 模块化(The Module)

基于Angular2应该是模块化的，即是"高内聚低耦合"的，一般来讲，Angular2里的Module即为导出的(export)一个可复用的组件类(Component Class), 组件是Angular的基本组成单元，如下代码:

    export class AppComponent implements OnInit {
        public title = 'Tour of Heroes';
        public selectedHero: Hero;
        public heroes: Hero[];

        constructor(private _heroService: HeroService) {}

        getHeroes() {
            this.heroes = this._heroService.getHeroes();
        }

        onSelect(hero: Hero) {
            this.selectedHero = hero;
        }

        ngOnInit() {
            this.getHeroes();
        }
    }
        

## 组件(Component）

## 模板(Template)

## 元数据(Angular Metadata)

## 数据绑定(Data Binding)

## 指令(Directive)

## 服务(Service)

## 依赖注入(Dependency Injection)
