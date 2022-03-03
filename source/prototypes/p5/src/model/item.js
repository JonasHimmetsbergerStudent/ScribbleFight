class Item {
    constructor(type) {
        this.type = type;
        switch (this.type) {
            case "bomb":
                this.ammo = 5;
                this.sprite = undefined;
            break;
            case "black_hole": 
                this.ammo = 5;
                this.sprite = undefined;
            break;
            case "piano":
                this.ammo = 10;
                this.sprite = undefined;
            break;
            case "mine":
                this.ammo  =3;
                this.sprite = [];
        }
    }
  }
 
