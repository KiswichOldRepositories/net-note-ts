export class Content {

    public content = (`<div class="content">
                            <div class="container-fluid">
                                <div class="row" id="content">

                                </div>
                            </div>
                        </div>`);
    public select: string;

    constructor(select: string) {
        // this.$content.appendTo(select);
       this.select = select;
    }


    public build = (): void => {
        $(this.select).append(this.content);
    };
}