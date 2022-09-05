import Component from '../../utils/component';
import StatisticsContainer from '../../components/statistics-container/statistics-container';
import './statistics.scss';

class Statistics extends Component {
  private StatisticsContainer: StatisticsContainer;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', ['statistics']);
    this.StatisticsContainer = new StatisticsContainer(this.element);
    this.StatisticsContainer.start();
  }
}

export default Statistics;
