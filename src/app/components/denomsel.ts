import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
    selector: 'denom-sel',
    templateUrl: 'denomsel.html'
})
export class DenomSelComponent {

    @Input()
    denom: number;

    @Output()
    updated: EventEmitter<void> = new EventEmitter();

    count: number = 0;

    plus(): void {
        this.count = Math.min(5, this.count+1);
        this.updated.emit();
    }

    minus(): void {
        this.count = Math.max(0, this.count-1);
        this.updated.emit();
    }

    amount(): number {
        return this.denom * this.count;
    }

    denomData(): any {
        return {
            d: this.denom,
            c: this.count
        }
    }
}
