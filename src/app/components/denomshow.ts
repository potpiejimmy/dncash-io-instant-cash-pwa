import { Component, Input } from "@angular/core";

@Component({
    selector: "denom-show",
    templateUrl: "denomshow.html"
})
export class DenomShowComponent {
    @Input()
    token;

    @Input()
    height;
}
