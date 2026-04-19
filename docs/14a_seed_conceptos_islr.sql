-- 14a_seed_conceptos_islr.sql
-- Seed inicial de conceptos ISLR 2025 para MVP

INSERT INTO "ConceptoRetencionISLR"
("codigoSeniat","numeral","literal","concepto","sujeto","baseImponiblePorcentaje","tipoTarifa","porcentajeRetencion","montoMinimoBs","sustraendoBs","usaMontoMinimo","usaSustraendo","requiereCalculoEspecial","formulaEspecial","notas","activo")
VALUES
('002','1','b/c/d','Honorarios profesionales','PNR',100,'PORCENTAJE',3.00,3583.34,107.50,true,true,false,NULL,'Incluye sociedades de personas',true),
('004','1','b','Honorarios profesionales','PJD',100,'PORCENTAJE',5.00,0,0,false,false,false,NULL,NULL,true),
('003','1','a','Honorarios profesionales','PNNR',90,'PORCENTAJE',34.00,0,0,false,false,false,NULL,'No residente',true),
('005','1','a','Honorarios profesionales','PJND',90,'TARIFA_2',NULL,0,0,false,false,false,NULL,'Acumulativa',true),
('018','2','a/b','Comisiones','PNR',100,'PORCENTAJE',3.00,3583.34,107.50,true,true,false,NULL,NULL,true),
('021','2','a/b','Comisiones','PJD',100,'PORCENTAJE',5.00,0,0,false,false,false,NULL,NULL,true),
('019','2','a/b','Comisiones','PNNR',100,'PORCENTAJE',34.00,0,0,false,false,false,NULL,NULL,true),
('020','2','a/b','Comisiones','PJND',100,'PORCENTAJE',5.00,0,0,false,false,false,NULL,NULL,true),
('053','11',NULL,'Servicios','PNR',100,'PORCENTAJE',1.00,3583.34,35.83,true,true,false,NULL,'Ejecución de obras y prestación de servicios',true),
('055','11',NULL,'Servicios','PJD',100,'PORCENTAJE',2.00,0,0,false,false,false,NULL,NULL,true),
('054','11',NULL,'Servicios','PNNR',100,'PORCENTAJE',34.00,0,0,false,false,false,NULL,NULL,true),
('056','11',NULL,'Servicios','PJND',100,'TARIFA_2',NULL,0,0,false,false,false,NULL,'Acumulativa',true),
('057','12',NULL,'Arrendamiento de bienes inmuebles','PNR',100,'PORCENTAJE',3.00,3583.34,107.50,true,true,false,NULL,NULL,true),
('059','12',NULL,'Arrendamiento de bienes inmuebles','PJD',100,'PORCENTAJE',5.00,0,0,false,false,false,NULL,'Incluye administradoras',true),
('058','12',NULL,'Arrendamiento de bienes inmuebles','PNNR',100,'PORCENTAJE',34.00,0,0,false,false,false,NULL,NULL,true),
('060','12',NULL,'Arrendamiento de bienes inmuebles','PJND',100,'TARIFA_2',NULL,0,0,false,false,false,NULL,'Acumulativa',true),
('061','13',NULL,'Arrendamiento de bienes muebles','PNR',100,'PORCENTAJE',3.00,3583.34,107.50,true,true,false,NULL,NULL,true),
('063','13',NULL,'Arrendamiento de bienes muebles','PJD',100,'PORCENTAJE',5.00,0,0,false,false,false,NULL,NULL,true),
('062','13',NULL,'Arrendamiento de bienes muebles','PNNR',100,'PORCENTAJE',34.00,0,0,false,false,false,NULL,NULL,true),
('064','13',NULL,'Arrendamiento de bienes muebles','PJND',100,'PORCENTAJE',5.00,0,0,false,false,false,NULL,NULL,true),
('071','15',NULL,'Fletes y gastos de transporte nacional','PNR',100,'PORCENTAJE',1.00,3583.34,35.83,true,true,false,NULL,NULL,true),
('072','15',NULL,'Fletes y gastos de transporte nacional','PJD',100,'PORCENTAJE',3.00,0,0,false,false,false,NULL,NULL,true),
('083','19',NULL,'Publicidad y propaganda','PNR',100,'PORCENTAJE',3.00,3583.34,107.50,true,true,false,NULL,NULL,true),
('084','19',NULL,'Publicidad y propaganda','PJD',100,'PORCENTAJE',5.00,0,0,false,false,false,NULL,NULL,true),
('085','19',NULL,'Publicidad y propaganda','PJND',100,'PORCENTAJE',5.00,0,0,false,false,false,NULL,NULL,true),
('086','19',NULL,'Publicidad y propaganda emisoras de radio','PJD',100,'PORCENTAJE',3.00,0,0,false,false,false,NULL,NULL,true);
