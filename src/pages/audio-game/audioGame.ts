import AudioGameContainer from "../../components/audioGame-container/audioGameContainer";
import Component from "../../utils/component";
import mainImage from '../../assets/img/audio-game-bg.jpg';
import './audioGame.scss';


class AudioGame extends Component {
    private audioGameContainer: AudioGameContainer; 

    constructor(parentNode: HTMLElement) {
        super(parentNode, 'div', ['audio-page']);

        this.audioGameContainer = new AudioGameContainer(this.element);
        this.audioGameContainer.element.style.backgroundImage = `linear-gradient( rgba(255, 255, 255, 0), rgba(0, 0, 0, 1) ), url('${mainImage}')`;

    }
}
export default AudioGame;