import place_pre_detail_importance_1 from '../../../../assets/images/icons/placeImportance/place_pre_detail_importance_1.png';
import place_pre_detail_importance_2 from '../../../../assets/images/icons/placeImportance/place_pre_detail_importance_2.png';
import place_pre_detail_importance_3 from '../../../../assets/images/icons/placeImportance/place_pre_detail_importance_3.png';

export function ImportanceIcon(importance: number) {
  const importanceIcon = () => {
    switch (importance) {
      case 1:
        return place_pre_detail_importance_1;
      case 2:
        return place_pre_detail_importance_2;
      case 3:
        return place_pre_detail_importance_3;
      default:
        return place_pre_detail_importance_1;
    }
  };
  return importanceIcon();
}
