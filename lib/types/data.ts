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
  showName: "",
  intermissionLength: 15,
  primaryColor: "transparent",
  secondaryColor: "transparent",
  splash: "",
});
