nest g mo admin
nest g co admin
nest g s admin

nest g mo client
nest g co client
nest g s client

nest g mo chefCuisinier
nest g co chefCuisinier
nest g s chefCuisinier

nest g mo cuisinier
nest g co cuisinier
nest g s cuisinier

nest g mo livreur
nest g co livreur
nest g s livreur


typeorm-model-generator -h localhost -d cuisine_db -u postgres -x berthin -e postgres -o ./src/entities --noConfig --convertCaseEntity camel --convertCaseProperty camel --generateConstructor --lazy
