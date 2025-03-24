import java.io.BufferedReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Random;

public class Player {

    public static int universeWidth;
    public static int universeHeight;
    public static String myColor;

    public static ArrayList<String> otherPlayersPlanets = new ArrayList<>();
    public static ArrayList<String> myPlanets = new ArrayList<>();


    public static void main(String[] args) throws Exception {


        /*
            **************
            Main game loop
            **************
            - each iteration of the loop is one turn.
            - this will loop until we stop playing the game
            - we will be stopped if we die/win or if we crash
        */

        while (true) {

            /*
                - at the start of turn we first recieve data
                about the universe from the game.
                - data will be loaded into the static variables of
                this class
            */
            getGameState();

            /*
                *********************************
                LOGIC: figure out what to do with
                your turn
                *********************************
                - current plan: attack randomly
            */
            Random rand = new Random();

            if (!otherPlayersPlanets.isEmpty()) {

                for (String myPlanet : myPlanets) {

                    String randomPLayerIndex = otherPlayersPlanets.get(rand.nextInt(otherPlayersPlanets.size()));
                    System.out.println("/A " + myPlanet + " " + randomPLayerIndex);

                }

            }

            /*
			    - send a hello message to your teammate bot :)
			    - it will recieve it form the game next turn (if the bot parses it)
			*/

            System.out.println("/M Hello");

           /*
			    - with the help of planet debuging /P print names on planets.
			    - same can be done for fleets using /F
			*/

            for (String myPlanet : myPlanets) {
                System.out.println("/P " + myPlanet + " My planet " + myPlanet);
            }


             /*
                - E will end my turn.
                - you should end each turn (if you don't the game will think you timed-out)
                - after E you should send no more commands to the game
             */
            System.out.println("/E");

        }

    }



    /**
     * This function should be called at the start of each turn to obtain information about the current state of the game.
     * The data received includes details about planets and fleets, categorized by color and type.
     *
     * Feel free to modify and extend this function to enhance the parsing of game data to your needs.
     *
     * @throws NumberFormatException if parsing numeric values from the input fails.
     * @throws IOException if an I/O error occurs while reading input.
     **/

    public static void getGameState() throws NumberFormatException, IOException {

        // Clear arrays from previous turn
        myPlanets.clear();
        otherPlayersPlanets.clear();

        BufferedReader stdin = new BufferedReader(new java.io.InputStreamReader(System.in));

        /*
			********************************
			read the input from the game and
			parse it (get data from the game)
			********************************
			- game is telling us about the state of the game (who ows planets
			and what fleets/attacks are on their way).
			- The game will give us data line by line.
			- When the game only gives us "/S", this is a sign
			that it is our turn and we can start calculating out turn.
			- NOTE: some things like parsing of fleets(attacks) is not implemented
			and you should do it yourself
		*/

		//Loop until the game signals to start playing the turn with "/S"
        String line;
        while (!(line = stdin.readLine()).equals("/S")) {

            String[] tokens = line.split(" ");
            char command = line.charAt(1);

            switch (command) {

                case 'U':

                    //U <int> <int> <string>
                    //- Universe: Size (x, y) of playing field, and your color

                    universeWidth = Integer.parseInt(tokens[1]);
                    universeHeight = Integer.parseInt(tokens[2]);
                    myColor = tokens[3];

                    break;

                case 'P':

                    //P <int> <int> <int> <float> <int> <string>
                    //- Planet: Name (number), position x, position y,
                    //planet size, army size, planet color (blue, cyan, green, yellow or null for neutral)

                    String planetColor = tokens[6];
                    String planetName = tokens[1];

                    if (planetColor.equals(myColor)) myPlanets.add(planetName);
                    else otherPlayersPlanets.add(planetName);

                    break;

                default:
                    break;
            }
        }
    }
}
