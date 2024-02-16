import place_pre_detail_importance_1 from '../../../../assets/images/icons/placeImportance/place_pre_detail_importance_1.png';
import place_pre_detail_importance_2 from '../../../../assets/images/icons/placeImportance/place_pre_detail_importance_2.png';
import place_pre_detail_importance_3 from '../../../../assets/images/icons/placeImportance/place_pre_detail_importance_3.png';
import place_pre_detail_importance_4 from '../../../../assets/images/icons/placeImportance/place_pre_detail_importance_4.png';
import place_pre_detail_importance_5 from '../../../../assets/images/icons/placeImportance/place_pre_detail_importance_5.png';
import place_pre_detail_importance_star from '../../../../assets/images/icons/placeImportance/place_pre_detail_importance_star.png';

export function ImportanceIcon(importance: number) {
  const importanceIcon = () => {
    switch (importance) {
      case 1:
        return place_pre_detail_importance_1;
      case 2:
        return place_pre_detail_importance_2;
      case 3:
        return place_pre_detail_importance_3;
      case 4:
        return place_pre_detail_importance_4;
      case 5:
        return place_pre_detail_importance_5;
      case 6:
        return place_pre_detail_importance_star;
      default:
        return place_pre_detail_importance_1;
    }
  };
  return importanceIcon();
}
