import HtmlWebpackPlugin from "html-webpack-plugin";
import { ITeam } from "../../interfaces";
import Component from "../../utils/component";
import team from "./teamlist";

class TeamItem extends Component{
    item: ITeam;

    constructor(parentNode: HTMLElement, item: ITeam) {
        super(parentNode, 'div', ['team__item']);
        this.item = item;

        const image = new Component(this.element, 'div', ['item__image']);
        image.element.style.backgroundImage = `url(${this.item.image})`;
        const itemList =  new Component(this.element, 'ul', ['item__list'])
        const name = new Component(itemList.element, 'li', ['list__name'], `${this.item.name}`);
        const proffesion = new Component(itemList.element, 'li', ['list__profession'], `${this.item.profession}`);
        const task = new Component(itemList.element, 'li', ['list__task'], `${this.item.task}`);
        const github = new Component(itemList.element, 'li', ['list__github']);
        const gitLink = new Component(github.element, 'a', ['github__link'], `github`);
        const link = gitLink.element as HTMLAnchorElement;
        link.href = `${this.item.github}`;

    }
}

export default TeamItem;