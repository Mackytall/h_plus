# read the workflow template
WORKFLOW_TEMPLATE=$(cat .github/workflow-template.yaml)

# iterate each route in routes directory
for SERVICE in $(ls packages); do
	echo "generating workflow for packages/${SERVICE}"

	SECRET=$(echo $SERVICE | tr '-' '_')
	SECRETUPPERCASE=$(echo $SECRET | tr '[:lower:]' '[:upper:]')

	# replace template route placeholder with route name
	WORKFLOW=$(echo "${WORKFLOW_TEMPLATE}" | sed "s/{{SERVICE}}/${SERVICE}/g" | sed "s/{{SECRET}}/${SECRETUPPERCASE}/g")
	
	# save workflow to .github/workflows/{SERVICE}
	echo "${WORKFLOW}" > .github/workflows/${SERVICE}.yaml
done