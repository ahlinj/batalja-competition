import java.util.ArrayList;

public class NapadalniPanel {

    //lastnosti
    public int x; //pozicija
    public int y;
    public String color; //barva mojega igralca

    //hramba planetov
    ArrayList<Planet> mojiPlaneti;
    ArrayList<Planet> nevtralni;
    ArrayList<Planet> nasprotnik;
    ArrayList<Planet> myTeam;

    ArrayList<Ladice> MojeLadica;
    ArrayList<Ladice> nasprotneLdaice;
    //uporaben tutorial za spoznat ArrayList razred Jave
    //      https://www.programiz.com/java-programming/arraylist


    //konstruktor
    public NapadalniPanel(int x, int y, String color) {
        this.x = x;
        this.y = y;
        this.color = color;
        //ustvarimo hrabmo planetov
        mojiPlaneti = new ArrayList<>();
        nevtralni = new ArrayList<>();
        nasprotnik = new ArrayList<>();
        MojeLadica = new ArrayList<>();
        nasprotneLdaice = new ArrayList<>();
        myTeam = new ArrayList<>();
    }

    //glavna funkcija ki izvede napad
    public String napad() {
        if (!(mojiPlaneti.isEmpty() || nasprotnik.isEmpty())) {
            for (int i = 0; i < mojiPlaneti.size(); i++) {
                if (nevtralni.size() > 1) {
                    if (!(KdoJeBlizji(nevtralni, nasprotnik, i))) {
                        return NapadNajBlizjegaHitro(nasprotnik);
                    }
                }
            }
            if ((nevtralni.size() > 0)) {
                return NapadNajblizjega(nevtralni);
            } else {
                return NapadNajblizjega(nasprotnik);
            }
        }
        return "";
    }

    public String NapadNajBlizjegaObramba(ArrayList<Planet> planeti) {
        String napad = ""; //ustvarimo prazen napad
        for (int i = 0; i < mojiPlaneti.size(); i++) {
            Planet a = mojiPlaneti.get(i); //vrne planet na indeksu i
            Planet b = Razdalje(planeti, i);
            napad += a.napadiPlanet(b);
        }
        return napad;
    }

    public String NapadNajBlizjegaHitro(ArrayList<Planet> planeti) {
        String napad = ""; //ustvarimo prazen napad
        for (int i = 0; i < mojiPlaneti.size(); i++) {
            Planet a = mojiPlaneti.get(i); //vrne planet na indeksu i
            Planet b = Razdalje(planeti, i);
            if (mojiPlaneti.get(i).stladij >= 30) {
                napad += a.napadiPlanet(b);
            }
        }
        return napad;
    }

    public String NapadNajblizjega(ArrayList<Planet> planeti) {
        String napad = ""; //ustvarimo prazen napad
        for (int i = 0; i < mojiPlaneti.size(); i++) {
            Planet a = mojiPlaneti.get(i); //vrne planet na indeksu i
            Planet b = Razdalje(planeti, i);
            if (nevtralni.size() > 1) {
                if(mojiPlaneti.get(i).getStladij() <= 30) {
                    if (mojiPlaneti.size() < 3) {
                        if(mojiPlaneti.get(i).getStladij() > PovStLadicNaPlanetih(mojiPlaneti)){
                            if (b.getStladij() >= 50) {
                                planeti.remove(b);
                            }
                        }
                    }
                    b = Razdalje(planeti,i);
                    napad += a.napadiPlanet(b);
                } else {
                    if (mojiPlaneti.get(i).stladij >= PovStLadicNaPlanetih(mojiPlaneti)) {
                        napad += a.napadiPlanet(b);
                    }
                }
            } else {
                if (mojiPlaneti.size() > nasprotnik.size() ||
                        PovStLadicNaPlanetih(mojiPlaneti) > PovStLadicNaPlanetih(nasprotnik)+250) {
                    if (PovprecjeStLadicNaVsehPlanetih(mojiPlaneti, nasprotnik, nevtralni) >= 80) {
                        if (mojiPlaneti.get(i).getStladij() >= PovprecjeStLadicNaVsehPlanetih(mojiPlaneti, nasprotnik, nevtralni)) {
                            napad += a.napadiPlanet(b);
                        }
                    } else {
                        if (mojiPlaneti.get(i).getStladij() >= 50) {
                            napad += a.napadiPlanet(b);
                        }
                    }
                } else {
                    if (mojiPlaneti.get(i).getStladij() >= 50) {
                        napad += a.napadiPlanet(b);
                    }
                }
            }
        }
        return napad;
    }

    public String NapadNajvecjega(ArrayList<Planet> planeti) {
        String napad = ""; //ustvarimo prazen napad
        for (int i = 0; i < mojiPlaneti.size(); i++) {
            if (mojiPlaneti.get(i).stladij > 75) {
                Planet a = mojiPlaneti.get(i); //vrne planet na indeksu i
                Planet b = RazdaljaPlanetov(planeti, i);
                napad += a.napadiPlanet(b);
            }
        }
        return napad;
    }

    public Planet NapadenNajvecjiPlanet(ArrayList<Planet> planeti, Ladice a) {
        int ime_planeta = a.getIme();
        Planet b = null;
        for (int i = 0; i < planeti.size(); i++) {
            if (planeti.get(i).getIme() == (ime_planeta)) {
                b = planeti.get(i);
                return b;
            }
        }
        return b;
    }

    public String ObrambaNapada(ArrayList<Planet> planet) {
        String napad = "";
        Planet a = OgrozenPlanet();
        Planet b = Razdalje(planet, a.getIme());
        napad += b.napadiPlanet(a);
        return napad;
    }

    public Planet Razdalje(ArrayList<Planet> planeti, int m) {

        Planet a = mojiPlaneti.get(m);
        Planet c = null;
        double max = 500000000;
        double raz = 0;
        double j = a.getX();
        double h = a.getY();
        for (int i = 0; i < planeti.size(); i++) {
            Planet b = planeti.get(i);
            if (a != b) {
                double s = b.getX();
                double d = b.getY();
                raz = (Math.pow(j - s, 2) + Math.pow(h - d, 2));
                if (raz < max && raz > 0) {
                    max = raz;
                    c = planeti.get(i);
                }
            }
        }
        return c;
    }

    public Planet NajvecjiPlanet(ArrayList<Planet> planeti) {
        float max = 0;
        ArrayList<Planet> najvecjiplaneti = new ArrayList<>();
        Planet b = null;
        for (int i = 0; i < planeti.size(); i++) {
            Planet a = planeti.get(i);
            float v1 = 0;
            v1 = a.getVelikost();
            if (v1 > max) {
                max = v1;
                b = planeti.get(0);
            }
        }
        return b;
    }

    public Planet NajManjsiPlanet(ArrayList<Planet> planeti) {
        float max = 1000000;
        Planet b = null;
        for (int i = 0; i < planeti.size(); i++) {
            Planet a = planeti.get(i);
            float v1 = 0;
            v1 = a.getVelikost();
            if (v1 < max) {
                max = v1;
                b = planeti.get(i);
            }
        }
        return b;
    }

    public Planet RazdaljaPlanetov(ArrayList<Planet> planeti, int i) {

        Planet f = null;

        double max = 100000000;
        double q = 0;

        Planet a = planeti.get(i);
        double m = a.getX();
        double n = a.getY();
        for (int j = 0; j < planeti.size(); j++) {
            Planet b = planeti.get(j);
            double g = b.getX();
            double h = b.getY();
            q = (Math.pow(m - g, 2) + Math.pow(n - h, 2));
            if (g < max) {
                max = q;
                f = planeti.get(i);
            }
        }
        return f;
    }

    public boolean KdoJeBlizji(ArrayList<Planet> planeti, ArrayList<Planet> planeti2, int i) {
        Planet a = Razdalje(planeti, i);
        Planet b = Razdalje(planeti2, i);
        double x1 = a.getX();
        double y1 = a.getY();
        double x2 = b.getX();
        double y2 = b.getY();
        Planet c = mojiPlaneti.get(i);
        double x3 = c.getX();
        double y3 = c.getY();

        double sum1 = (Math.pow(x3 - x2, 2) + Math.pow(y3 - y2, 2));
        double sum2 = (Math.pow(x3 - x1, 2) + Math.pow(y3 - y1, 2));
        if (sum1 > sum2) {
            return true;
        } else {
            return false;
        }
    }

    public Ladice NajVecjifleat(ArrayList<Ladice> ladica) {
        int val = 0;
        int max = 0;
        Ladice c = null;
        for (int i = 0; i < ladica.size(); i++) {
            Ladice a = ladica.get(i);
            val = a.getVelikost();
            if (max < val) {
                max = val;
                c = ladica.get(i);
            }
        }
        return c;
    }

    public boolean AliJePlanetSevednoOgrozen() {
        Planet b = null;
        int n = 0;
        for (int i = 0; i < mojiPlaneti.size(); i++) {
            if (mojiPlaneti.get(i).stladij > n) {
                n = mojiPlaneti.get(i).stladij;
                if (mojiPlaneti.get(i).stladij < StladicVZraku(nasprotneLdaice, mojiPlaneti.get(i))) {
                    return true;
                }
            }
        }
        return false;
    }

    public Planet OgrozenPlanet() {
        Planet b = null;
        int n = 0;
        for (int i = 0; i < mojiPlaneti.size(); i++) {
            if (mojiPlaneti.get(i).stladij > n) {
                n = mojiPlaneti.get(i).stladij;
                if (mojiPlaneti.get(i).stladij < StladicVZraku(nasprotneLdaice, mojiPlaneti.get(i))) {
                    b = mojiPlaneti.get(i);
                }
            }
        }
        return b;
    }

    public int StLadicNaPlanetih(ArrayList<Planet> planeti) {
        int sum = 0;
        for (Planet planet : planeti) {
            sum = sum + planet.getStladij();
        }
        return sum;
    }

    public int PovStLadicNaPlanetih(ArrayList<Planet> planeti) {
        float a = StLadicNaPlanetih(planeti);
        float b = planeti.size();
        return (int) (a / b);
    }

    public int StVsehLadicNaplanetih(ArrayList<Planet> planeti1, ArrayList<Planet> planeti2, ArrayList<Planet> planeti3) {
        return StLadicNaPlanetih(planeti1) + StLadicNaPlanetih(planeti2) + StLadicNaPlanetih(planeti3);
    }

    public int PovprecjeStLadicNaVsehPlanetih(ArrayList<Planet> planeti, ArrayList<Planet> planeti2, ArrayList<Planet> planeti3) {
        return PovStLadicNaPlanetih(planeti) + PovStLadicNaPlanetih(planeti2) + PovStLadicNaPlanetih(planeti3);
    }

    public int StladicVZraku(ArrayList<Ladice> ladice, Planet a) {
        int sum = 0;
        for (Ladice ladica : ladice) {
            if (ladica.getNapadanplanet() == a.getIme()) {
                sum = sum + ladica.getVelikost();
            }
        }
        return sum;
    }

    public void dodajPlanet(String[] t) {
        Planet p = new Planet(t); //ustvarimo planet
        if (p.getColor().equals(this.color)) {
            //moji planeti
            mojiPlaneti.add(p);
        }else if (p.getColor().equals("null")) {
            //nevtralni planeti
            nevtralni.add(p);
        }else if (this.color.equals("green") && p.getColor().equals("yellow") || this.color.equals("yellow") && p.getColor().equals("green")) {
            myTeam.add(p);
        } else if (this.color.equals("cyan") && p.getColor().equals("blue") || this.color.equals("blue") && p.getColor().equals("cyan")) {
            myTeam.add(p);
        } else {
            //nasprotnikovi planeti
            nasprotnik.add(p);
        }
    }

    public void dodajFleat(String[] t) {
        Ladice f = new Ladice(t);
        int origin = f.getNapadalniplanet();


        boolean isPlayerFleet = false;
        boolean isEnemyFleet = false;
        for (Planet p : mojiPlaneti) {
            if (p.getIme() == origin) {

                isPlayerFleet = true;
                break;
            }
        }
        if (!isPlayerFleet) {
            for (Planet p : nasprotnik) {
                if (p.getIme() == origin) {
                    isEnemyFleet = true;
                    break;
                }
            }
        }
        if (isPlayerFleet) {
            for (int i = 0; i < MojeLadica.size(); i++) {
                if (MojeLadica.get(i).getIme() == f.getIme()) {
                    MojeLadica.remove(i-1);
                    MojeLadica.add(f);
                    return;
                }
            }
            MojeLadica.add(f);
        } else if (isEnemyFleet) {
            for (int i = 0; i < nasprotneLdaice.size(); i++) {
                if (nasprotneLdaice.get(i).getIme() == f.getIme()) {
                    nasprotneLdaice.remove(i-1);
                    nasprotneLdaice.add(f);
                    return;
                }
            }
            nasprotneLdaice.add(f);
        }
    }
}