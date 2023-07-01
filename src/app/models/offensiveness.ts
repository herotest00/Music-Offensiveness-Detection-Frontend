export interface Offensiveness {

    videoOffensiveness: {
        score: number;
        images: Image[];
    };
    audioOffensiveness: {
        score: number;
        text: Text[];
    };
}

export interface Image {
    image: string;
}
  
export interface Text {
    text: string;
    offensive: boolean;
}