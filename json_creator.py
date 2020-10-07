from sklearn.datasets import load_iris, load_boston, load_breast_cancer
from sklearn.tree import DecisionTreeClassifier
import pandas as pd
import json

def rules(clf, features, labels, node_index=0):
    node = {}
    if clf.tree_.children_left[node_index] == -1:  # indicates leaf
        count_labels = zip(clf.tree_.value[node_index, 0], labels)
        node['name'] = ', '.join(('{} of {}'.format(int(count), label)
                                  for count, label in count_labels))
    else:
        feature = features[clf.tree_.feature[node_index]]
        threshold = clf.tree_.threshold[node_index]
        node['name'] = '{} > {}'.format(feature, threshold)
        left_index = clf.tree_.children_left[node_index]
        right_index = clf.tree_.children_right[node_index]
        node['children'] = [rules(clf, features, labels, right_index),
                            rules(clf, features, labels, left_index)]
    return node


def csv_to_json(dataset):

    df = pd.read_csv(dataset)
    print(df.head())
    
    data = dataset

    target = df.index[0]
    df_data = df.drop(df.index[0])
    df_data = df.drop(df.iloc[:, :-1])

    clf = DecisionTreeClassifier(max_depth=3)
    # clf.fit(data.data, data.target)
    clf.fit(df_data, target)

    # rules(clf, df.columns, data.target_names)
    rules(clf, df.columns, df.columns)

    r = rules(clf, data.feature_names, data.target_names)
    with open(dataset+'.json', 'w') as f:
        f.write(json.dumps(r))

    