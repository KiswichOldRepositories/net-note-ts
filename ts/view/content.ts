
export class Content{

    public $content = $(`<div class="foot centor">
                              <a href="" style="margin-left: 20%">关于我们</a>
                              <span class="graytext">|</span>
                              <a href="">服务条款</a>
                              <span class="graytext">|</span>
                              <a href="">使用规范</a>
                              <span class="graytext">|</span>
                              <a href="">客服中心</a>
                          </div>`);


    constructor(select:string){
        this.$content.appendTo(select);
    }

    public build(){

    }
}