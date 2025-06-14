public class Fleet {
    //F	<int>,<int>,<int>,<int>,<int>,<int>
    //- flee name (number),
    //- fleet size
    //- origin planet
    //- destination planet
    //- current turn
    //- number of needed turns

    public int name;
    public int size;
    public String attackingPlanet;
    public String defendingPlanet;
    public int turn;
    public int numberOfTurns;
    public String color;
    public Fleet(String[] t){

        this.name = Integer.parseInt(t[1]);
        this.size = Integer.parseInt(t[2]);
        this.attackingPlanet = t[3];
        this.defendingPlanet = t[4];
        this.turn = Integer.parseInt(t[5]);
        this.numberOfTurns = Integer.parseInt(t[6]);
        this.color = t[7];
    }

    public int getName() {
        return name;
    }

    public int getSize() {
        return size;
    }

    public String  getAttackingPlanet() {
        return attackingPlanet;
    }

    public String  getDefendingPlanet() {
        return defendingPlanet;
    }

    public int getTurn() {
        return turn;
    }

    public int getNumberOfTurns() {
        return numberOfTurns;
    }

    public String getColor() {
        return color;
    }
}
