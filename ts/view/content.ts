
export class Content{

    public $content = $(`<div class="content">
                            <div class="container-fluid">
                                <div class="row" id="content">

                                </div>
                            </div>
                        </div>`);


    constructor(select:string){
        this.$content.appendTo(select);
    }

    public build(){

    }
}