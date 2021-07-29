class Item {
    constructor(type) {
        this.sprite = undefined;
        this.type = type;

        switch (this.type) {
            case "bomb":
                this.ammo = 5;
            break;
            case "black_hole": 
                this.ammo = 5;
            break;
            case "piano":
                this.ammo = 10;
            break;
        }
    }
  }
 
