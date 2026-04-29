export type { State, Configuration };

interface State {
  view: string;
  timerActive: boolean;
  seconds: number;
}

interface Configuration {
  showName: string;
  intermissionLength: number;
  primaryColor: string;
  secondaryColor: string;
  splash: string;
}

export const getDefaultState = (): State => ({
  view: "splash",
  timerActive: false,
  seconds: 0,
});

export const getDefaultConfiguration = (): Configuration => ({
  showName: "The Addams Family",
  intermissionLength: 15,
  primaryColor: "#FFF",
  secondaryColor: "#FFF",
  splash: "THE SHOW WILL BEGIN SHORTLY",
});
