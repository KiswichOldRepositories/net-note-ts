export class Foot {
    public foot :string= (`<div class="foot centor">
                            <a href="" style="margin-left: 20%">关于我们</a>
                            <span class="graytext">|</span>
                            <a href="">服务条款</a>
                            <span class="graytext">|</span>
                            <a href="">使用规范</a>
                            <span class="graytext">|</span>
                            <a href="">客服中心</a>
                       </div>`);
    public select:string;

    constructor(select: string) {
        this.select = select;
    }

    public build = (): void => {
        // this.$foot.appendTo(this.select);
        $(this.select).append(this.foot);

    };
}