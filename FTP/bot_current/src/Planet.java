public class Planet {

    //P	<int>,<int>,<int>,<float>,<int>,<string>	Planet:	- name (number), - position x, - position y, - planet size, - fleet size, - planet color (red, blue or null)

    //lastnosti
    public int ime;
    public int x;//pozicija
    public int y;
    public float velikost;
    public int stladij;
    public String color;

    //konstruktor
    public Planet(String[] t){
        this.ime = Integer.parseInt(t[1]);
        this.x = Integer.parseInt(t[2]);
        this.y = Integer.parseInt(t[3]);
        this.velikost = Float.parseFloat(t[4]);
        this.stladij = Integer.parseInt(t[5]);
        this.color = t[6];
    }

    //getter
    public String getColor() {
        return this.color;
    }

    public int getIme() {
        return this.ime;
    }

    public int getX() {
        return x;
    }

    public int getY() {
        return y;
    }

    public float getVelikost() {
        return velikost;
    }

    public int getStladij() {
        return stladij;
    }
    //zapisi potezo kot string
    // this planet napade planet b
    public String napadiPlanet(Planet b) {
        String poteza = "A" + " ";
        poteza += this.ime + " "; //planet A ki napada
        poteza += b.getIme() + "\n"; //napadan planet
        return poteza;
    }

}
